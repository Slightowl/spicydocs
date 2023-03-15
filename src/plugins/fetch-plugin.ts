
import * as esbuild from 'esbuild-wasm';
import axios from 'axios'; 
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {


            build.onLoad({ filter: /(^index\.js$)/ }, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode,
                };
            });

            build.onLoad({ filter: /.*/}, async (args: any) => {
                // check to see if file already fetched and in cached
                // if it is return it  immediately
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
                if (cachedResult ) {
                    return cachedResult;
                }
            })

            // handles css stuff
            build.onLoad({ filter: /.css$/}, async (args: any) => {
                console.log('onLoad', args);
                const { data, request } = await axios.get(args.path);

                // find and replace new line, single and double quoutes 
                const escaped = data
                .replace(/\n/g, '')
                .replace(/"/g, '\\"')
                .replace(/'/g, "\\'");

                // handle css snippets
                const contents = 
                `
                const style = document.createElement('style');
                style.innerText = '${escaped}';
                document.head.appendChild(style);
                `;

                const result: esbuild.OnLoadResult =  {
                    loader: 'jsx',
                    contents,
                    resolveDir: new URL('./', request.responseURL).pathname
                };
                // store response in cache
                await fileCache.setItem(args.path, result);
                return result;

            });


            // handles js stuff
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);
                const { data, request } = await axios.get(args.path);

                const result: esbuild.OnLoadResult =  {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                };
                // store response in cache
                await fileCache.setItem(args.path, result);
                return result;
            });
        }
    }
}


