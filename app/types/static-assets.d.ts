// Tell TypeScript how to type-import static assets
declare module "*.png" {
    const src: string;
    export default src;
}
