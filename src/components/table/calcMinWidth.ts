export interface WidthList {
    [key: string]: number
}

export function calcMinWidth (table: HTMLTableElement, cellMinWidth = 50): WidthList {
    const maxWidth = table.clientWidth
    const widthList: WidthList = {}
    let total = 0

    if (maxWidth === 0) {
        return {}
    }

    const tr = table.querySelectorAll('tr')

    tr.forEach(td => {
        td.querySelectorAll('td, th').forEach((item) => {
            const cell = item.querySelector<HTMLElement>('.cell')
            const cellItems = item.querySelectorAll<HTMLElement>('.cell > *')
            const name: RegExpMatchArray | null = item.className.match(/mark_(\S+)/)

            let width = cellMinWidth
            for (const el of cellItems) {
                width += el.offsetWidth
            }

            if (name) {
                const n = name[1]

                if (n === 'operation') {
                    width += 30
                }

                if (n in widthList) {
                    if (widthList[n] < width) {
                        widthList[n] = width
                    }
                } else {
                    widthList[n] = cell?.offsetWidth || 0
                }
            }
        })
    })

    // 计算总宽度
    for (const i in widthList) {
        total += widthList[i]
    }

    if (total < maxWidth) {
        let length = Object.keys(widthList).length

        if ('selection' in widthList) {
            length -= 1
        }
        if ('operation' in widthList) {
            length -= 1
        }

        const empty = (maxWidth - total) / length
        for (const i in widthList) {
            if (i === 'selection' || i === 'operation') {
                continue
            }
            widthList[i] += empty
        }
    }

    return widthList
}
