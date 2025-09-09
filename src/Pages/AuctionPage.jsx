import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Car,
    Gauge,
    Palette,
    Droplet,
    Cog,
    Fuel,
    CheckCircle2,
    XCircle,
    ChevronLeft,
} from "lucide-react"
import { Link } from "react-router-dom"


export default function AuctionPage() {
    const [values, setValues] = useState({
        mileage: "",
        exteriorColor: "",
        interiorColor: "",
        bodyType: "",
        transmission: "",
        engineType: "",
        bodyEngineType: "",
    })
    const [touched, setTouched] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [step, setStep] = useState(0) // 0,1,2
    const [showAll, setShowAll] = useState(false)

    const fields = useMemo(() => ([
        { key: "mileage", label: "Mileage", placeholder: "e.g. 42,500", Icon: Gauge, type: "number" },
        { key: "exteriorColor", label: "Exterior Color", placeholder: "Select color", Icon: Palette, type: "select", options: ["Black", "White", "Silver", "Gray", "Blue", "Red", "Green"] },
        { key: "interiorColor", label: "Interior Color", placeholder: "Select color", Icon: Droplet, type: "select", options: ["Black", "Beige", "Brown", "Gray", "White"] },
        { key: "bodyType", label: "Body Type", placeholder: "Select body type", Icon: Car, type: "select", options: ["Sedan", "SUV", "Hatchback", "Truck", "Coupe", "Convertible", "Van"] },
        { key: "transmission", label: "Transmission", placeholder: "Select transmission", Icon: Cog, type: "select", options: ["Automatic", "Manual"] },
        { key: "engineType", label: "Engine Type", placeholder: "e.g. 2.0L Turbo", Icon: Fuel, type: "text" },
        { key: "bodyEngineType", label: "Body Engine Type", placeholder: "e.g. V6 / Hybrid", Icon: Cog, type: "text" },
    ]), [])

    function validate(key, value) {
        switch (key) {
            case "mileage":
                return /^\d{1,7}$/.test(value.replaceAll(",", ""))
            case "engineType":
                return /[A-Za-z0-9]/.test(value) && value.trim().length >= 2
            case "bodyEngineType":
                return /[A-Za-z0-9]/.test(value) && value.trim().length >= 2
            default:
                return value && value.length > 0
        }
    }

    const errors = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, !validate(k, v)])
    )

    const completedCount = Object.keys(values).filter((k) => validate(k, values[k])).length
    const allValid = completedCount === Object.keys(values).length

    function handleChange(key, raw) {
            let v = key === "mileage" ? raw.replace(/[^0-9]/g, "").substring(0, 7) : raw
            setValues((prev) => ({ ...prev, [key]: v }))
    }

    function handleBlur(key) {
        setTouched((prev) => ({ ...prev, [key]: true }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setSubmitted(true)
        if (allValid) {
            setTimeout(() => setShowSuccess(true), 300)
        }
    }

    const stepperSteps = ["Basics", "Appearance", "Powertrain"]
    const currentStep = step

    return (
        <>
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
            {/* Animated background accents */}
            <motion.div
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="mx-auto max-w-7xl px-6 py-12">
                <h1 className="mb-[1.5rem] text-center text-4xl text-[var(--brand-purple)] font-bold">Vehicle details</h1>
                {/* Main content grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Form panel */}
                    <div className="lg:col-span-8">
                        <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl md:p-8">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <motion.h2
                                    key={`title-${step}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="text-xl font-semibold text-slate-900"
                                >
                                    {step === 0 ? "Vehicle basics" : step === 1 ? "Appearance" : "Powertrain"}
                                </motion.h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAll(!showAll)}
                                        className={`cursor-pointer h-9  rounded-xl border px-3 text-xs font-medium transition ${showAll ? 'border-slate-300 bg-white text-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:scale-[1.01]'}`}
                                    >
                                        {showAll ? 'Show by steps' : 'Show all fields'}
                                    </button>
                                </div>
                            </div>
                            <motion.p
                                key={`desc-${step}-${showAll}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: 0.05 }}
                                className="-mt-2 mb-2 text-sm text-slate-600"
                            >
                                {showAll ? 'All fields visible at once.' : step === 0 ? 'Tell us general info that impacts demand.' : step === 1 ? 'Choose colors to help dealers match inventory.' : 'What powers the car?'}
                            </motion.p>
                            <form onSubmit={handleSubmit} className="grid gap-6">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {fields
                                  .filter(({ key }) => showAll ? true : (
                                    step === 0 ? ["mileage", "bodyType", "transmission"].includes(key)
                                    : step === 1 ? ["exteriorColor", "interiorColor"].includes(key)
                                    : ["engineType", "bodyEngineType"].includes(key)
                                  ))
                                  .map(({ key, label, placeholder, Icon, type, options }) => {
                                    const value = values[key]
                                    const hasError = (touched[key] || submitted) && errors[key]
                                    const isValid = (touched[key] || submitted) && !errors[key]
                                    return (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="grid gap-2"
                                        >
                                            <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-slate-500" />
                                                {label}
                                            </label>
                                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                                               
                                                {type === "select" ? (
                                                    key === "exteriorColor" || key === "interiorColor" ? (
                                                        <div className="">
                                                            <div className="flex flex-wrap gap-2">
                                                                {options.map((opt) => {
                                                                    const colorMap = {
                                                                        Black: "bg-black",
                                                                        White: "bg-white border border-slate-300",
                                                                        Silver: "bg-slate-300",
                                                                        Gray: "bg-gray-500",
                                                                        Blue: "bg-blue-500",
                                                                        Red: "bg-red-500",
                                                                        Green: "bg-green-500",
                                                                        Beige: "bg-amber-200",
                                                                        Brown: "bg-amber-700",
                                                                    }
                                                                    const selected = value === opt
                                                                    return (
                                                                        <button
                                                                            key={opt}
                                                                            type="button"
                                                                            onClick={() => { handleChange(key, opt); handleBlur(key) }}
                                                                            className={`cursor-pointer group inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium ${selected ? "border-[#f6851f] bg-orange-50 text-slate-900" : "border-slate-200 bg-white text-slate-700"}`}
                                                                        >
                                                                            <span className={`inline-block h-4 w-4 rounded-full ${colorMap[opt] || "bg-slate-400"}`}></span>
                                                                            {opt}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : key === "bodyType" ? (
                                                        <div className="">
                                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                                {options.map((opt) => {
                                                                    const selected = value === opt
                                                                    return (
                                                                        <button
                                                                            key={opt}
                                                                            type="button"
                                                                            onClick={() => { handleChange(key, opt); handleBlur(key) }}
                                                                            className={`cursor-pointer flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition ${selected ? "border-[#f6851f] bg-orange-50 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                                                                        >
                                                                            <Car className="h-4 w-4 text-slate-500" /> {opt}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : key === "transmission" ? (
                                                        <div className="">
                                                            <div className="flex flex-wrap gap-2">
                                                                {options.map((opt) => {
                                                                    const selected = value === opt
                                                                    return (
                                                                        <button
                                                                            key={opt}
                                                                            type="button"
                                                                            onClick={() => { handleChange(key, opt); handleBlur(key) }}
                                                                            className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${selected ? "border-[#f6851f] bg-orange-50 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                                                                        >
                                                                            <Cog className="h-4 w-4 text-slate-500" /> {opt}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : null
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type={type}
                                                            value={key === "mileage" && value ? Number(value) : value}
                                                            onChange={(e) => handleChange(key, e.target.value)}
                                                            onBlur={() => handleBlur(key)}
                                                            placeholder={placeholder}
                                                            className={`h-11 w-full rounded-xl border bg-white px-3 pr-20 text-sm outline-none transition-shadow ${hasError ? "border-red-300 focus:shadow-[0_0_0_4px_rgba(225,29,72,0.15)]" : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"}`}
                                                        />
                                                        {key === "mileage" && (
                                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">km</span>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                            {hasError && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-xs text-red-600"
                                                >
                                                    {label} is required.
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>

                                {/* Footer actions */}
                                <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                                    <button
                                        type="button"
                                        onClick={() => (step === 0 ? history.back() : setStep(step - 1))}
                                        className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.01] "
                                    >
                                        <ChevronLeft className="h-4 w-4" /> {step === 0 ? "Back" : "Previous"}
                                    </button>
                                    {!showAll && step < 2 ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // mark fields touched in this step
                                                const keys = step === 0 ? ["mileage", "bodyType", "transmission"] : ["exteriorColor", "interiorColor"]
                                                setTouched((prev) => ({ ...prev, ...Object.fromEntries(keys.map(k => [k, true])) }))
                                                const ok = keys.every((k) => validate(k, values[k]))
                                                if (ok) setStep(step + 1)
                                            }}
                                            className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] "
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            onClick={() => setTouched((prev) => ({ ...prev, engineType: true, bodyEngineType: true }))}
                                            className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] "
                                        >
                                            {showAll ? 'Submit' : 'Confirm'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Live Preview / Summary panel */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-orange-100 to-rose-100">
                                            <Car className="h-5 w-5 text-[#f6851f]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Live preview</p>
                                            <p className="text-xs text-slate-600">{completedCount}/7 complete</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                    <motion.div
                                        className="h-2 rounded-full bg-gradient-to-r from-[#f6851f] to-[#e63946]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (completedCount / 7) * 100)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Mileage</p>
                                        <p className="font-medium text-slate-900">{values.mileage ? Number(values.mileage).toLocaleString() : "—"}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Body Type</p>
                                        <p className="font-medium text-slate-900">{values.bodyType || "—"}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Transmission</p>
                                        <p className="font-medium text-slate-900">{values.transmission || "—"}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Exterior</p>
                                        <p className="font-medium text-slate-900">{values.exteriorColor || "—"}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Interior</p>
                                        <p className="font-medium text-slate-900">{values.interiorColor || "—"}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Engine</p>
                                        <p className="font-medium text-slate-900">{values.engineType || "—"}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-xs text-slate-500">Body Engine</p>
                                        <p className="font-medium text-slate-900">{values.bodyEngineType || "—"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                                <p className="mb-2 text-sm font-semibold text-slate-900">Tips</p>
                                <ul className="space-y-1 text-sm text-slate-700">
                                    <li>• Keep details accurate for better offers.</li>
                                    <li>• If unsure, you can edit later before confirming.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success state */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="mx-4 w-full max-w-lg rounded-2xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50 p-8 text-center shadow-2xl"
                        >
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 340, damping: 18 }}>
                                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                            </motion.div>
                            <div className="mt-4 space-y-1">
                                <h3 className="text-xl font-semibold text-slate-900">All vehicle details captured successfully</h3>
                                <p className="text-sm text-slate-600">You're ready to start your live auction.</p>
                            </div>
                            <div className="mt-6">
                                <Link
                                    to="/condition-assessment"
                                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:scale-[1.01]"
                                >
                                    Continue
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </>
    )
}
