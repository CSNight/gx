import REQ from './services'

export function getShapes() {
    return REQ.get('/shape/getAllShape');
}
export function getDictByClazz(clazz) {
    return REQ.get('/dict/getDictByClazz/' + clazz);
}