import { useState} from "react";

interface AchievementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (achievement: string, skill: string) =>void;

}

export default function AchievementModal({ isOpen, onClose, onAdd }: AchievementModalProps) {   
    const [achievement, setAchievement] = useState("");
    const [skill, setSkill] = useState("");

    const handleSubmit = () => {
        if (achievement && skill) {
            onAdd(achievement, skill);
            setAchievement("");
            setSkill("");
            
        }
   };

   if (!isOpen) return null;

   return (
    <div className= "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
        <div className="bg-gray-900 p-6 rounded-1g w-96"></div>
            <h2 className="text-2xl font-bold mb-4">Add Achievement & Skill</h2>
            <input 
                type="text"
                placeholder="Enter your Achievement"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded-1g"
            />
            <input 
                type="text"
                placeholder="Enter your Skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded-1g"
            />
            <div className="flex justify-end space-x-4">
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-1g hover:bg-gray-600"
                    onClick= {onClose}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-1g hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Add
                </button>                               
            </div>
        </div>
   );
}   

///components/AchievementModal.tsx

///