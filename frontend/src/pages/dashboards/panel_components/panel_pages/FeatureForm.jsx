import { useEffect, useState } from "react";
import navConfig from "../../../../configurations/navConfig";
import FloatingLabelInput from '../main_components/FloatingLabelInput'
import FloatingLabelSelect from '../main_components/FloatingLabelSelect'
import { useNavigate, useSearchParams } from "react-router-dom";

function FeatureForm() {
    const navigate = useNavigate();

    // Action switch variables.
    const [searchParams, setSearchParams] = useSearchParams();
    const action = searchParams.get("action");
    const isCreate = action === "update" ? false : true;
    const featureId = searchParams.get("featureId");

    const available_modules = navConfig.map(config => config.module);
    const roles = ["superuser", "backoffice", "teacher", "admin", "student", "parent"];
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedModule, setModule] = useState("");
    const [path, setPath] = useState("");
    const [selectedRoles, setRoles] = useState(["superuser"]);

    const [isCreating, setCreating] = useState(false);

    const toggleRole = (role) => {
        setRoles((prev) =>
            prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role]
        );
    };

    const newFeatureRequest = async (e) => {
        const submissionUrl = "/api/v1/feature-flag";
        try {
            setCreating(true);
            const request = await fetch(submissionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Feature-Id": featureId
                },
                body: JSON.stringify({
                    label: name,
                    description,
                    module: selectedModule,
                    path,
                    allowedTo: selectedRoles
                })
            })
            if (!request.ok) {
                throw new Error((await request.json()).message);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const updateFeatureRequest = async (e) => { };

    const instructionsMap = {
        create: { label: "Name the feature and add a short description.", module: "Select the module, the sidebar tab in which the feature will be shown.", path: "Describe the relative path to the final destination of the feature.", roles: "Select the roles allowed for this feature.", submitBtnLabel: "Create" },
        update: { label: "Edit the name or the description.", module: "Change the Module.", path: "Change the path to this feature (Unintended changes may make this feature unusable).", roles: "Alter the roles accessing this feature.", submitBtnLabel: "Update" }
    }

    if (!featureId) {
        return <span className="text-red-400 text-center">Invalid path params!</span>
    };

    return (
        <div className="p-4 overflow-auto">
            <h1 className="font-bold text-2xl">
                {isCreate ? "Create New Feature" : "Edit Exisiting Feature"}
            </h1>
            <p className="text-sm text-gray-700 mb-2">Feature flags let you turn functionality on or off for specific parts of the system without deploying new code. Give the flag a clear label and key, assign the module it belongs to, and it will be available to enable or disable from the features list.</p>
            <form
                action="#"
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (isCreate) {
                        newFeatureRequest(e);
                    } else {
                        updateFeatureRequest(e);
                    }
                }}>
                <p>{isCreate ? instructionsMap.create.label : instructionsMap.update.label}</p>
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

                <p>{isCreate ? instructionsMap.create.module : instructionsMap.update.module}</p>

                <FloatingLabelSelect
                    label="Module"
                    name="module"
                    value={selectedModule}
                    onChange={(e) => setModule(e.target.value)}
                    options={available_modules}
                    required
                />

                <p>{isCreate ? instructionsMap.create.path : instructionsMap.update.path}</p>

                <FloatingLabelInput
                    label="Path"
                    name="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    required
                />

                <p>{isCreate ? instructionsMap.create.roles : instructionsMap.update.roles}</p>

                <fieldset className="flex gap-6 border border-gray-300 rounded-md w-fit px-3 py-4">
                    {roles.map((role) => (
                        <label key={role} style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role)}
                                onChange={() => toggleRole(role)}
                            />
                            {"  " + role}
                        </label>
                    ))}
                </fieldset>
                <button
                    type="submit"
                    className="bg-primary-400 text-page px-3 py-3 w-fit rounded-md min-w-30 text-center hover:cursor-pointer">
                    {isCreate ? instructionsMap.create.submitBtnLabel : instructionsMap.update.submitBtnLabel}
                </button>
            </form>
        </div>
    )
}

export default FeatureForm;