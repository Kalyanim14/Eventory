"use client";
import { useEffect, useState } from "react";
const CATEGORIES = [
    { id: "planner", icon: "✦", title: "Event Planner", desc: "Bring your vision to life, end to end." },
    { id: "performer", icon: "♫", title: "Performer", desc: "Find talent that keeps the crowd moving." },
    { id: "crew", icon: "◉", title: "Crew", desc: "Build the reliable team behind the scenes." },
];
const STEPS = ["Event basics", "Your needs", "Preferences", "Review & post"];
const SERVICES = ["Decor", "Catering", "Photography", "Entertainment", "Venue booking", "Logistics"];
const CREW_ROLES = ["Sound", "Lighting", "Videography", "Ushers", "Security", "Stage hands"];
const COMMUNITY_ROLES = ["Drone operator", "Makeup artist", "Live stream tech"];
const emptyForm = { 
  organizerKind: "individual", 
  organizerName: "", 
  organizationName: "", 
  name: "", type: "", eventTypeOther: "", dateMode: "single", startDate: "", endDate: "", country: "India", state: "", city: "", pincode: "", venue: "", category: "", budgetMin: "", budgetMax: "", guests: "", services: [], customService: "", style: "", experience: "any", deadline: "", notes: "", performerType: "", performerTypeOther: "", genre: "", duration: "", customDuration: "", budget: "", audience: "", equipment: "yes", language: "", languageOther: "", stageRequirements: "", roles: [], customRole: "", crewCount: "", dayBudget: "", shiftStart: "", shiftEnd: "", experienceLevel: "intermediate", transport: "yes", meals: "yes" };

function Field({ label, required, hint, children }) { return <label className="field">
<span>{label}{required && <b> *</b>}</span>{children}{hint && <small>{hint}</small>}</label>; }

function Chips({ values, selected, onChange }) { return <div className="chips">{values.map((value) => <button type="button" key={value} className={selected.includes(value) ? "chip active" : "chip"} onClick={() => onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value])}>{selected.includes(value) && <i>✓</i>}{value}</button>)}</div>; }

function CreatableChips({ values, communityValues = [], selected, onChange, customValue, setCustomValue, label }) { 
  const add = () => { const value = customValue.trim(); if (value && !selected.includes(value))
    onChange([...selected, value]); setCustomValue(""); }; return <>
  <Chips values={values} selected={selected} onChange={onChange}/>{communityValues.length > 0 && <>
    <p className="chip-caption">Popular community roles</p>
    <Chips values={communityValues} selected={selected} onChange={onChange}/></>}<div className="add-custom">
    <input value={customValue} onChange={(event) => setCustomValue(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), add())} placeholder={`Add a custom ${label}`}/>
    <button type="button" onClick={add}>+ Add</button>
  </div>
  </>; 
}

function Header() { return <header className="topbar">
<div className="brand">
<span>e</span>EVENTORY</div>
<div className="header-right">
<button className="help">Need help?</button>
<button className="profile">AK</button>
</div>
</header>; }

function Progress({ step, setStep }) { return <div className="progress-wrap">
<div className="progress">
<div className="progress-line"/>
<div className="progress-fill" style={{ width: `${(step - 1) * 33.33}%` }}/>{STEPS.map((title, index) => <button key={title} className={`progress-step ${step >= index + 1 ? "done" : ""} ${step === index + 1 ? "current" : ""}`} onClick={() => step > index + 1 && setStep(index + 1)}>
<span>{step > index + 1 ? "✓" : index + 1}</span>
<em>{title}</em>
</button>)}</div>
</div>; }
export default function RequirementWizard() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(() => { if (typeof window === "undefined")
        return emptyForm; const draft = sessionStorage.getItem("requirement-draft"); return draft ? { ...emptyForm, ...JSON.parse(draft) } : emptyForm; });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    useEffect(() => { sessionStorage.setItem("requirement-draft", JSON.stringify(form)); }, [form]);
    const validate = () => { const today = new Date().toISOString().slice(0, 10); if (step === 1) {
        if (!form.organizerName.trim() || (form.organizerKind === "organization" && !form.organizationName.trim()))
            return "Please add organizer details.";
        if (!form.type || !form.startDate || !form.country || !form.pincode.trim() || !form.category)
            return "Please complete all required fields.";
        if (form.startDate < today)
            return "Your event date can’t be in the past.";
        if (form.dateMode === "range" && (!form.endDate || form.endDate < form.startDate))
            return "End date must be on or after the start date.";
    } if (step === 2) {
        if (form.category === "planner" && (!form.budgetMin || !form.budgetMax || !form.guests || !form.services.length))
            return "Add your budget, guest count and at least one service.";
        if (form.category === "performer" && (!form.performerType || !form.genre.trim() || !form.duration || !form.budget))
            return "Please complete all performance details.";
        if (form.category === "crew" && (!form.roles.length || !form.crewCount || !form.dayBudget))
            return "Please add crew roles, count and daily budget.";
    } return ""; };
    const next = () => { const message = validate(); if (message)
        return setError(message); setError(""); setStep((current) => current + 1); };
    const selectCategory = (category) => setForm((current) => current.category === category ? current : { ...emptyForm, organizerKind: current.organizerKind, organizerName: current.organizerName, organizationName: current.organizationName, name: current.name, type: current.type, eventTypeOther: current.eventTypeOther, dateMode: current.dateMode, startDate: current.startDate, endDate: current.endDate, country: current.country, state: current.state, city: current.city, pincode: current.pincode, venue: current.venue, category });
    const submit = async () => { setSubmitting(true); setError(""); const payload = { category: form.category, organizer: { kind: form.organizerKind, name: form.organizerName.trim(), organizationName: form.organizationName.trim() }, event: { name: form.name.trim(), type: form.type, typeOther: form.eventTypeOther.trim(), startDate: form.startDate, endDate: form.dateMode === "range" ? form.endDate : form.startDate, country: form.country, state: form.state.trim(), location: form.city.trim(), pincode: form.pincode.trim(), venue: form.venue.trim() }, details: form }; try {
        const response = await fetch("/api/requirements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok)
            throw new Error((await response.json().catch(() => ({}))).message || "Unable to post your requirement. Please try again.");
        const data = await response.json();
        setSuccess(data.requirement?._id || data.id || "REQ-" + Math.random().toString(36).slice(2, 8).toUpperCase());
        sessionStorage.removeItem("requirement-draft");
    }
    catch (exception) {
        setError(exception.message || "Network error. Your draft is safe — please retry.");
    }
    finally {
        setSubmitting(false);
    } };
    if (success)
        return <main className="shell">
<Header />
<section className="success-card">
<div className="confetti">✦</div>
<div className="success-icon">✓</div>
<p className="eyebrow">REQUIREMENT POSTED</p>
<h1>You&apos;re all set!</h1>
<p>Your {form.category} requirement is live and ready for the right people.</p>
<div className="id">Requirement ID <strong>{success}</strong>
</div>
<button className="primary" onClick={() => { setForm(emptyForm); setStep(1); setSuccess(""); }}>Post another requirement <span>→</span>
</button>
</section>
</main>;
    return <main className="shell">
<Header />
<Progress step={step} setStep={setStep}/>
<section className="workspace">
<aside>
<p className="eyebrow">POST A REQUIREMENT</p>
<h1>{step === 1 ? "Let’s start with the basics." : step === 2 ? "Tell us what you need." : step === 3 ? "A few finishing details." : "Review your requirement."}</h1>
<p className="intro">{step === 1 ? "A little context helps us match you with exactly the right people." : step === 4 ? "Check everything looks right, then make it live." : "Your requirement is saved as you go — you can come back anytime."}</p>
<div className="journey-note">
<span>{String(step).padStart(2, "0")}</span>
<p><strong>Simple by design</strong>Four thoughtful steps to a better match.</p>
</div>
<div className="save-note">
<span>✓</span> Draft saved automatically</div>
</aside>
<div className="form-card">{step === 1 && <StepOne form={form} update={update} selectCategory={selectCategory}/>} {step === 2 && <StepTwo form={form} update={update}/>} {step === 3 && <StepThree form={form} update={update}/>} {step === 4 && <Review form={form} edit={setStep}/>} {error && <div className="error">
<span>!</span>{error}<button onClick={() => setError("")}>×</button>
</div>}<div className="actions">{step > 1 ? <button className="back" onClick={() => { setError(""); setStep(step - 1); }}>← Back</button> : <span />}{step < 4 ? <button className="primary" onClick={next}>Continue <span>→</span>
</button> : <button className="primary" disabled={submitting} onClick={submit}>{submitting ? <>
<i className="spinner"/> Posting requirement</> : <>Post requirement <span>→</span></>}</button>}</div>
</div>
</section>
<footer>
<span>© 2026 Eventory</span>
<a>Privacy</a>
<a>Terms</a>
</footer>
</main>;
}

function StepOne({ form, update, selectCategory }) { return <>
<div className="card-heading">
<h2>Event basics</h2>
<p>Tell us about the occasion and who is posting it.</p>
</div>
<Field label="Posting as" required>
<div className="identity-toggle">
<button type="button" className={form.organizerKind === "individual" ? "active" : ""} onClick={() => update("organizerKind", "individual")}>Independent / individual</button>
<button type="button" className={form.organizerKind === "organization" ? "active" : ""} onClick={() => update("organizerKind", "organization")}>Organisation</button>
</div>
</Field>
<div className="fields two">
<Field label="Organizer Name" required>
<input value={form.organizerName} onChange={(event) => update("organizerName", event.target.value)} placeholder="Your Full Name"/>
</Field>{form.organizerKind === "organization" && <Field label="Organisation Name" required>
<input value={form.organizationName} onChange={(event) => update("organizationName", event.target.value)} placeholder="Your organisation"/>
</Field>}</div>
<div className="fields two">
<Field label="Event Name">
<input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Riya & Arjun’s wedding"/>
</Field>
<Field label="Event type" required>
<select value={form.type} onChange={(event) => update("type", event.target.value)}>
<option value="">Select event type</option>{["Wedding", "Corporate", "Birthday", "Concert", "Festival", "Private Party", "Other"].map((item) => <option key={item}>{item}</option>)}</select>
</Field>
</div>{form.type === "Other" && <Field label="Other event type" hint="Optional">
<input value={form.eventTypeOther} onChange={(event) => update("eventTypeOther", event.target.value)} placeholder="Describe the event type"/>
</Field>}<div className="date-area">
<div className="field">
<span>Date <b>*</b>
</span>
<div className="toggle">
<button className={form.dateMode === "single" ? "active" : ""} onClick={() => update("dateMode", "single")}>Single date</button>
<button className={form.dateMode === "range" ? "active" : ""} onClick={() => update("dateMode", "range")}>Date range</button>
</div>
</div>
<div className={form.dateMode === "range" ? "dates range" : "dates"}>
<Field label={form.dateMode === "range" ? "Start date" : "Event date"} required>
<input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)}/>
</Field>{form.dateMode === "range" && <Field label="End date" required>
<input type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)}/>
</Field>}</div>
</div>
<div className="fields three">
<Field label="Country" required>
<select value={form.country} onChange={(event) => update("country", event.target.value)}>
<option>India</option>
<option>United States</option>
<option>United Kingdom</option>
<option>Other</option>
</select>
</Field>
<Field label="State">
<input value={form.state} onChange={(event) => update("state", event.target.value)} placeholder="e.g. Telangana"/>
</Field>
<Field label="City">
<input value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="e.g. Hyderabad"/>
</Field>
</div>
<div className="fields two">
<Field label="Pincode" required>
<input inputMode="numeric" value={form.pincode} onChange={(event) => update("pincode", event.target.value)} placeholder="e.g. 500001"/>
</Field>
<Field label="Venue" hint="Optional">
<input value={form.venue} onChange={(event) => update("venue", event.target.value)} placeholder="e.g. Taj Falaknuma"/>
</Field>
</div>
<div className="category-title">
<span>What are you looking for? <b>*</b>
</span>
<small>Choose one category to continue</small>
</div>
<div className="categories">{CATEGORIES.map((category) => <button type="button" className={`category ${form.category === category.id ? "selected" : ""}`} key={category.id} onClick={() => selectCategory(category.id)}>
<div className="category-icon">{category.icon}</div>
<div>
<strong>{category.title}</strong>
<p>{category.desc}</p>
</div>{form.category === category.id && <i className="check">✓</i>}</button>)}</div></>; }

function StepTwo({ form, update }) { const category = form.category; const allSelected = SERVICES.every((service) => form.services.includes(service)); const header = <div className="card-heading">
<div className="mini-badge">{CATEGORIES.find((item) => item.id === category)?.icon} {CATEGORIES.find((item) => item.id === category)?.title}</div>
<h2>{category === "planner" ? "Planning needs" : category === "performer" ? "Performance details" : "Crew needs"}</h2>
</div>; if (category === "performer")
    return <>{header}<div className="fields two">
<Field label="Performer type" required>
<select value={form.performerType} onChange={(event) => update("performerType", event.target.value)}>
<option value="">Choose a type</option>{["Singer", "DJ", "Band", "Dancer", "Comedian", "Magician", "Other"].map((item) => <option key={item}>{item}</option>)}</select>
</Field>
<Field label="Genre or style" required>
<input value={form.genre} onChange={(event) => update("genre", event.target.value)} placeholder="e.g. Bollywood, Indie"/>
</Field>
</div>{form.performerType === "Other" && <Field label="Other performer type" hint="Optional">
<input value={form.performerTypeOther} onChange={(event) => update("performerTypeOther", event.target.value)} placeholder="Describe the performer type"/>
</Field>}<div className="fields two">
<Field label="Performance duration" required hint="Use a time value, e.g. 02:30 for 2 hours 30 minutes">
<input type="time" value={form.duration} onChange={(event) => update("duration", event.target.value)}/>
</Field>
<Field label="Your budget (₹)" required>
<input type="number" min="1" value={form.budget} onChange={(event) => update("budget", event.target.value)} placeholder="e.g. 50000"/>
</Field>
</div></>; if (category === "crew")
    return <>{header}<Field label="Roles applied" required>
<CreatableChips values={CREW_ROLES} communityValues={COMMUNITY_ROLES} selected={form.roles} onChange={(values) => update("roles", values)} customValue={form.customRole} setCustomValue={(value) => update("customRole", value)} label="role"/>
</Field>
<div className="fields two">
<Field label="Number of crew members" required>
<input type="number" min="1" value={form.crewCount} onChange={(event) => update("crewCount", event.target.value)} placeholder="e.g. 8"/>
</Field>
<Field label="Budget per day (₹)" required>
<input type="number" min="1" value={form.dayBudget} onChange={(event) => update("dayBudget", event.target.value)} placeholder="e.g. 15000"/>
</Field>
</div></>; return <>{header}<div className="fields two">
<Field label="Budget range (₹)" required>
<div className="split">
<input inputMode="numeric" value={form.budgetMin} onChange={(event) => update("budgetMin", event.target.value)} placeholder="Min"/>
<input inputMode="numeric" value={form.budgetMax} onChange={(event) => update("budgetMax", event.target.value)} placeholder="Max"/>
</div>
</Field>
<Field label="Expected guest count" required>
<input type="number" min="1" value={form.guests} onChange={(event) => update("guests", event.target.value)} placeholder="e.g. 250"/>
</Field>
</div>
<Field label="Services needed" required>
<div className="service-all">
<button type="button" className={allSelected ? "chip active" : "chip"} onClick={() => update("services", allSelected ? form.services.filter((service) => !SERVICES.includes(service)) : [...new Set([...form.services, ...SERVICES])])}>All services</button>
</div>
<CreatableChips values={SERVICES} selected={form.services} onChange={(values) => update("services", values)} customValue={form.customService} setCustomValue={(value) => update("customService", value)} label="service"/>
</Field></>; }

function Switch({ label, value, update }) { return <div className="switch-row">
<span>{label}</span>
<div className="toggle">
<button className={value === "yes" ? "active" : ""} onClick={() => update("yes")}>Yes</button>
<button className={value === "no" ? "active" : ""} onClick={() => update("no")}>No</button>
</div>
</div>; }

function StepThree({ form, update }) { const category = form.category; return <>
<div className="card-heading">
<h2>{category === "planner" ? "Preferences" : category === "performer" ? "Requirements" : "Logistics"}</h2>
<p>These details help us make an even better match.</p>
</div>{category === "planner" ? <>
<div className="fields two">
<Field label="Planning style or theme">
<input value={form.style} onChange={(event) => update("style", event.target.value)} placeholder="e.g. Modern garden party"/>
</Field>
<Field label="Planner experience preferred">
<select value={form.experience} onChange={(event) => update("experience", event.target.value)}>
<option value="any">Any experience</option>
<option value="2+ yrs">2+ years</option>
<option value="5+ yrs">5+ years</option>
</select>
</Field>
</div>
<Field label="Planning deadline" hint="Optional">
<input type="date" value={form.deadline} onChange={(event) => update("deadline", event.target.value)}/>
</Field></> : category === "performer" ? <>
<div className="fields two">
<Field label="Audience size">
<input type="number" min="1" value={form.audience} onChange={(event) => update("audience", event.target.value)} placeholder="e.g. 300"/>
</Field>
<Field label="Language preference">
<select value={form.language} onChange={(event) => update("language", event.target.value)}>
<option value="">No preference</option>
<option>Hindi</option>
<option>English</option>
<option>Telugu</option>
<option>Other</option>
</select>
</Field>
</div>{form.language === "Other" && <Field label="Other language" hint="Optional">
<input value={form.languageOther} onChange={(event) => update("languageOther", event.target.value)} placeholder="Enter language preference"/>
</Field>}<Switch label="Will the host provide equipment?" value={form.equipment} update={(value) => update("equipment", value)}/>
<Field label="Stage or sound requirements" hint="Optional">
<textarea value={form.stageRequirements} onChange={(event) => update("stageRequirements", event.target.value)} placeholder="Share any technical requirements..."/>
</Field></> : <>
<div className="fields two">
<Field label="Shift timing">
<div className="split">
<input type="time" value={form.shiftStart} onChange={(event) => update("shiftStart", event.target.value)}/>
<input type="time" value={form.shiftEnd} onChange={(event) => update("shiftEnd", event.target.value)}/>
</div>
</Field>
<Field label="Experience level">
<select value={form.experienceLevel} onChange={(event) => update("experienceLevel", event.target.value)}>
<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="expert">Expert</option>
</select>
</Field>
</div>
<Switch label="Is transport provided?" value={form.transport} update={(value) => update("transport", value)}/>
<Switch label="Are meals provided?" value={form.meals} update={(value) => update("meals", value)}/></>}<Field label="Additional notes" hint="Optional">
<textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Anything else we should know?"/>
</Field></>; }

function Summary({ title, step, edit, rows }) { return <div className="summary">
<div className="summary-head">
<h3>{title}</h3>
<button onClick={() => edit(step)}>Edit</button>
</div>{rows.map(([label, value]) => <div className="summary-row" key={label}>
<span>{label}</span>
<strong>{value || "—"}</strong>
</div>)}</div>; }

function Review({ form, edit }) { const title = CATEGORIES.find((item) => item.id === form.category)?.title; const details = form.category === "planner" ? [["Budget", `₹${form.budgetMin} – ₹${form.budgetMax}`], ["Guests", form.guests], ["Services", form.services.join(", ")]] : form.category === "performer" ? [["Performer", form.performerType === "Other" ? form.performerTypeOther || "Other" : form.performerType], ["Style", form.genre], ["Duration", form.duration === "custom" ? form.customDuration : `${form.duration} minutes`], ["Budget", `₹${form.budget}`]] : [["Roles", form.roles.join(", ")], ["Crew", form.crewCount], ["Daily budget", `₹${form.dayBudget}`]]; return <>
<div className="review-top">
<div className="mini-badge large">{CATEGORIES.find((item) => item.id === form.category)?.icon} {title}</div>
<h2>Ready to post?</h2>
<p>Here’s a summary of your requirement.</p>
</div>
<Summary title="Organizer & event" step={1} edit={edit} rows={[["Posting as", form.organizerKind === "organization" ? form.organizationName : "Independent / individual"], ["Organizer", form.organizerName], ["Event", form.name], ["Type", form.type === "Other" ? form.eventTypeOther || "Other" : form.type], ["When", form.startDate + (form.endDate && form.endDate !== form.startDate ? ` — ${form.endDate}` : "")], ["Where", [form.city, form.state, form.country, form.pincode, form.venue].filter(Boolean).join(" · ")]]}/>
<Summary title={form.category === "planner" ? "Planning needs" : form.category === "performer" ? "Performance details" : "Crew needs"} step={2} edit={edit} rows={details}/>
<Summary title="Preferences & notes" step={3} edit={edit} rows={[["Notes", form.notes || "No additional notes"]]}/></>; }
