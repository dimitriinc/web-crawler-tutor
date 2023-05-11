import { crawlPage } from "./crawl.js"
import { printPages } from "./report.js"

async function main() {
    if (process.argv.length < 3) {
        console.log("no website provided")
        process.exit(1)
    }

    if (process.argv.length > 3) {
        console.log("too many args provided")
        process.exit(1)
    }
    
    const baseURL = process.argv[2]

    console.log(`starting crawl ${baseURL}`)

    const pages = await crawlPage(baseURL, baseURL, {})

    printPages(pages)
}

main()