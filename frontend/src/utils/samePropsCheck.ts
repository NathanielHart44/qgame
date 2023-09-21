export default function samePropsCheck(obj1: any, obj2: any): boolean {
    const obj1Props = Object.getOwnPropertyNames(obj1);
    const obj2Props = Object.getOwnPropertyNames(obj2);

    if (obj1Props.length !== obj2Props.length) {
        return false;
    }

    for (let prop of obj1Props) {
        if (!obj2.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true;
}