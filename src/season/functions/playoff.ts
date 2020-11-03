import Root = cheerio.Root;

export const extractPlayoff = ($: Root, year: number) => {
  $('table#all_playoffs  tr').map((i, el) => {
    const e = el;

  })
}
