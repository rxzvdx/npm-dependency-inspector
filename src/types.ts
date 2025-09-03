export type Scorecard = {
    name: string
    version: string
    license: string | null
    weeklyDownloads: number | null
    dependencyCount: number | null
    unpackedSize: number | null
    lastPublish: string | null
}