import { useTheme } from "../hooks/useTheme"

function PayPage() {
    const { dark, toggle } = useTheme();

    return (
        <div className="bg-surface h-lvh w-full grid place-items-center">
            <button onClick={toggle} className="absolute right-5 top-5 px-3 py-2 border border-primary-action ">
                Theme
            </button>
            <div className="bg-page flex flex-col gap-4 p-6 rounded-4xl shadow-el-2 min-w-80 max-w-90">
                <h1 className="text-copy text-2xl font-medium">
                    Pay page
                </h1>
                <p className="text-copy">
                    Pay ₹1500 to This&That School <br/> againt #TTS_2026_697
                </p>
                <div className="flex items-center justify-end gap-4 text-sm font-medium">
                    <button className="text-copy cursor-pointer hover:underline active:underline">
                        Cancel
                    </button>
                    <button className="text-surface px-4 py-3 rounded-full bg-primary-300 cursor-pointer hover:bg-primary-hover active:bg-primary-hover transition-colors duration-150">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PayPage