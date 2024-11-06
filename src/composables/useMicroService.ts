import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';


interface MicroServiceOptions {
    url?: string | undefined;
    shouldLoadJs: boolean;
    shouldLoadCss: boolean;
    jsPath?: string;
    cssPath?: string;
    jsMountSuffix?: string;
    cssMountSuffix?: string;
}

interface RouteMeta {
    mountId?: string;
    remoteUrl?: string;
}

const useMicroService = (
    options: MicroServiceOptions = {
        shouldLoadJs: true,
        shouldLoadCss: false,
        jsPath: 'src/main.ts',
        cssPath: 'src/style.css',
        jsMountSuffix: '-js',
        cssMountSuffix: '-css',
    },
) => {
    const url = ref(options?.url);
    const shouldLoadJs = ref(options?.shouldLoadJs);
    const shouldLoadCss = ref(options?.shouldLoadCss);
    const jsPath = ref(options?.jsPath);
    const cssPath = ref(options?.cssPath);
    const jsMountSuffix = ref(options?.jsMountSuffix);
    const cssMountSuffix = ref(options?.cssMountSuffix);

    let unmountHook: () => void = () => { };

    const loadJs = (microAppId: string, remote: string | undefined) => {
        const realUrl = remote || url.value || microAppId;

        const existingScript = document.getElementById(`${microAppId}${jsMountSuffix.value}`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = `${microAppId}-js`;
            script.src = `${realUrl}/${jsPath.value}`;
            script.type = 'module';
            document.body.appendChild(script);
        }
    };
    const loadCss = (microAppId: string, remote: string | undefined) => {
        const realUrl = remote || url.value || microAppId;
        const link = document.createElement('link');
        link.id = `${microAppId}${cssMountSuffix.value}`;
        link.href = `${realUrl}/${cssPath.value}`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    onMounted(() => {
        const route = useRoute();
        const { meta } = route;
        const { mountId, remoteUrl }: RouteMeta = meta;

        if (mountId) {
            if (shouldLoadJs.value) {
                loadJs(mountId, remoteUrl as string);
            }
            if (shouldLoadCss.value) {
                loadCss(mountId, remoteUrl);
            }
            unmountHook = () => {
                document.getElementById(`${mountId}${jsMountSuffix.value}`)?.remove();
                document.getElementById(`${mountId}${cssMountSuffix.value}`)?.remove();
            };
        }
    });

    onUnmounted(() => {
        unmountHook();
    });

    return {
        loadJs,
        loadCss,
    };
};

export default useMicroService;
