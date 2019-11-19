class Point {
    private _x: number;
    constructor(x: number) {
        this._x = x;
    }

    @configurable(false)
    get x() {
        return this._x;
    }
}

function configurable(value: boolean) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.configurable = value;
    };
}
