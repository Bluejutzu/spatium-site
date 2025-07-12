import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="bg-discord-dark font-minecraft min-h-screen">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-discord-dark via-discord-darker to-black" />
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="floating-orb floating-orb-1" />
                <div className="floating-orb floating-orb-2" />
                <div className="floating-orb floating-orb-3" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-white">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-discord-blurple" />
                        <div className="absolute inset-0 h-12 w-12 rounded-full bg-discord-blurple/20 animate-ping" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Loading Commands</h2>
                        <p className="text-discord-text">Fetching your bot commands...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
