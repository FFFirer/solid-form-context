import type { FieldName } from "./types";

const IsNotUndefinedOrNull = <T>(obj?: T): obj is T => {
    return obj !== undefined && obj !== null
}

const IsNotWhitespaceString = (obj?: string) => {
    return IsNotUndefinedOrNull(obj) && obj?.trim() !== '';
}

const IsValidFieldName = (path?: FieldName): path is FieldName => {
    return IsNotUndefinedOrNull(path)
        && (typeof path === 'string'
            ? path.trim() !== ''
            : typeof path === 'number'
                ? path >= 0
                : false);
}

export const IsObjectOrArray = (obj: any) => {
    return IsNotUndefinedOrNull(obj) && (typeof obj === 'object' || Array.isArray(obj))
}

const ExistsProps = (props?: any, name?: string) => {
    if (IsNotUndefinedOrNull(props) && typeof props === 'object' && IsNotUndefinedOrNull(name)) {
        return Object.keys(props).includes(name)
    }

    return false;
}

const RebuildObj = (obj: any) => {
    if (IsNotUndefinedOrNull(obj)) {
        if (Array.isArray(obj)) {
            return [...obj];
        }
        else if (typeof obj === 'object') {
            return {
                ...obj
            }
        }
    }

    return obj
}

export default {
    IsNotUndefinedOrNull,
    IsNotWhitespaceString,
    IsValidFieldName,
    ExistsProps,
    IsObjectOrArray,
    RebuildObj
}
