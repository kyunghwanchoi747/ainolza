/** 평문 → Payload Lexical 에디터 JSON 포맷으로 변환 */
export function textToLexical(text: string): object {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              format: 0,
              version: 1,
              detail: 0,
              mode: 'normal',
              style: '',
              text,
            },
          ],
        },
      ],
    },
  }
}

/** Payload Lexical JSON에서 평문 추출 */
export function lexicalToText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const root = (data as any).root
  if (!root?.children) return ''

  function extract(nodes: any[]): string {
    return nodes
      .map((n: any) => {
        if (n.type === 'text') return n.text ?? ''
        if (Array.isArray(n.children)) return extract(n.children)
        return ''
      })
      .join('')
  }

  return extract(root.children)
}
