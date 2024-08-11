export default function Input({label, type = "number", handleChange, value}) {

    return (
        <p>
            <label>{label}</label>
            <input type={type} onChange={handleChange} value={value} required/>
        </p>
    )
}