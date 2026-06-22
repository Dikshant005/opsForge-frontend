import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "./ticketSlice";

const CreateTicket = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if(file){
            formData.append('file', file);
        }
        try{
            await dispatch(createTicket(formData)).unwrap();
            // Clear form fields after successful submission
            setTitle('');
            setDescription('');
            setFile(null);
            alert("Ticket Created!")
        }
        catch(error){
            console.error('Failed to create ticket:', error);
        }
    };

    return (
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4 p-4 border rounded">
          
          {/* TITLE FIELD */}
          <div className="flex flex-col">
              <label htmlFor="ticketTitle" className="font-bold text-gray-700">Ticket Title</label>
              <input 
                  id="ticketTitle" 
                  name="title"
                  type="text" 
                  autoComplete="off"
                  placeholder="e.g., Login button is broken" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="border p-2 rounded"
              />
          </div>

          {/* DESCRIPTION FIELD */}
          <div className="flex flex-col">
              <label htmlFor="ticketDesc" className="font-bold text-gray-700">Description</label>
              <textarea 
                  id="ticketDesc" 
                  name="description"
                  autoComplete="off"
                  placeholder="Describe the issue in detail..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="border p-2 rounded h-24"
              />
          </div>

          {/* FILE UPLOAD FIELD */}
          <div className="flex flex-col">
              <label htmlFor="ticketFile" className="font-bold text-gray-700">Attach Screenshot (Optional)</label>
              <input 
                  id="ticketFile" 
                  name="file"
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  className="border p-2 rounded"
              />
          </div>
          
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
              Submit Ticket
          </button>
      </form>
  )
}

export default CreateTicket;