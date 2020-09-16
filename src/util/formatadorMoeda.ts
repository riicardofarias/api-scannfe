
export function mascaraReais(valor?: number): string {
    if (!valor) {
        return "R$ 0,0"
    }

    let valorString = Math.round(valor).toString()
    
    switch (valorString.length) {
        case 1:
            valorString = `0,0${valorString}`
            break
        case 2:
            valorString = `0,${valorString}`
            break
        case 3:
            valorString = valorString.replace(/(\d{1})(\d{2})/, "$1,$2")
            break
        case 4:
            valorString = valorString.replace(/(\d{2})(\d{2})/, "$1,$2")
            break
        case 5:
            valorString = valorString.replace(/(\d{3})(\d{2})/, "$1,$2")
            break
        case 6:
            valorString = valorString.replace(/(\d{1})(\d{3})(\d{2})/, "$1.$2,$3")
            break
        case 7:
            valorString = valorString.replace(/(\d{2})(\d{3})(\d{2})/, "$1.$2,$3")
            break
        case 8:
            valorString = valorString.replace(/(\d{3})(\d{3})(\d{2})/, "$1.$2,$3")
            break
        case 9:
            valorString = valorString.replace(/(\d{1})(\d{3})(\d{3})(\d{2})/, "$1.$2,$3,$4")
            break
        default:
            break
    }
    return `R$ ${valorString}`
}