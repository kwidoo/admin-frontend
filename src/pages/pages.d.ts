declare module '_pages' {
    import type { DefineComponent } from 'vue';

    interface ComponentProps {}
    interface ComponentEmits {}
    interface ComponentSlots {}

    export const Component: DefineComponent<ComponentProps, ComponentEmits, ComponentSlots>;
}
