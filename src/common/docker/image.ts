import { Log } from "../log";

/**
 * docker iamge
 */
export default class Image {
    private image: any;

    constructor(image: any) {
        this.image = image;
    }

    public async inspect() {
        if (!this.image) {
            throw new Error('container is null.');
        }
        try {
            return await this.image.inspect();
        } catch (error) {
            Log.error(error);
        }
        return "";
    }

    public async history() {
        if (!this.image) {
            throw new Error('container is null.');
        }

        const data: any[] = [];
        try {
            const layers = await this.image.history();
            if (!layers) {
                return data;
            }

            layers.forEach((layer, index: number) => {
                if (layer) {
                    const size = (layer.Size / 1000 / 1000).toFixed(2) + ' MB'
                    data.push([(layers.length - index).toString(), size.toString(), layer.CreatedBy.toString()]);
                }
            });
            data.push(['Order', 'Size', 'Layer']);
            data.reverse();
        } catch (error) {
            Log.error(error);
            data.push(['Error', error.errno]);
        }
        return data;
    }
}
