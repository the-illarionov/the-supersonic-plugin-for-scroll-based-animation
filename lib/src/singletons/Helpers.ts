function throwError(message: string) {
	throw new Error(message)
}

function supersonicToFixed(number: number, precision: number) {
	precision = 10 ** precision
	return ~~(number * precision) / precision
}

export { throwError, supersonicToFixed }
