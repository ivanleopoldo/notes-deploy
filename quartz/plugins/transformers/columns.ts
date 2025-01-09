import { QuartzTransformerPlugin } from "../types"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { visit } from "unist-util-visit"

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
          const processedContent = unified()
            .use(remarkParse)
            .use(remarkStringify)
            .processSync(columnContent.trim())
            .toString()
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
