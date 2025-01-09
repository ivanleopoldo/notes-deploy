import { QuartzTransformerPlugin } from "../types"

export const Columns: QuartzTransformerPlugin = () => {
  return {
    name: "Columns",
    textTransform(_ctx, src) {
      const colBlockRegex = new RegExp(/^````col\n([\s\S]*?)````$/gm)
      
      src = src.toString()
      
      return src.replace(colBlockRegex, (match, content) => {
        const colMdRegex = new RegExp(/```(col-md(?:-\d+(?:\.\d+)?)?)\n([\s\S]*?)```/g)
        const columns = []
        let colMatch

        while ((colMatch = colMdRegex.exec(content)) !== null) {
          const [_, className, columnContent] = colMatch
          const processedContent = columnContent.trim().replace(
            /^(#{1,6})\s+(.+)$/gm,
            (match, hashes, text) => {
              const level = hashes.length
              const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
              return `<h${level} id="${slug}">${text}<a role="anchor" aria-hidden="true" tabindex="-1" data-no-popover="true" href="#${slug}" class="internal"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></a></h${level}>`
            }
          )
          columns.push({ className, content: processedContent })
        }

        const columnDivs = columns
          .map(col => `<div class="${col.className}">${col.content}</div>`)
          .join('\n')

        return `<div class="multi-column">\n${columnDivs}\n</div>`
      })
    }
  }
}
