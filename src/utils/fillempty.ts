const fillString = (value: string, def: string) => value === '' ? def : value
const fillNumber = (value: number, def: number) => value === 0 ? def : value

export { fillString, fillNumber }
