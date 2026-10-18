import { useState } from "react";
import FloatingLabelInput from '../main_components/FloatingLabelInput'
import FloatingLabelSelect from '../main_components/FloatingLabelSelect'

function NewFeatureForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");

    return (
        <div className="p-4">
            <h1 className="font-bold text-2xl">Create New Feature</h1>
            <p className="text-sm text-gray-700 mb-2">Feature flags let you turn functionality on or off for specific parts of the system without deploying new code. Give the flag a clear label and key, assign the module it belongs to, and it will be available to enable or disable from the features list.</p>
            <form className="flex flex-col gap-2" action="#">
                <FloatingLabelInput
                    label="Label"
                    name="featureLabel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <FloatingLabelInput
                    label="Description"
                    name="featureDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <FloatingLabelSelect
                    label="Role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={[
                        { value: "admin", label: "Admin" },
                        { value: "teacher", label: "Teacher" },
                        { value: "student", label: "Student" },
                    ]}
                    required
                />
            </form>
        </div>
    )
}

export default NewFeatureForm;