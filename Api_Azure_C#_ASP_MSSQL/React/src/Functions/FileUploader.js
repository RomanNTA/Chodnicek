import React, { useState } from "react";

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Soubor úspěšně odeslán!");
        } else {
          console.error("Chyba při odesílání souboru.");
        }
      } catch (error) {
        console.error("Došlo k chybě:", error);
      }
    } else {
      alert("Prosím, vyberte soubor.");
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      {selectedFile && <p>Vybraný soubor: {selectedFile.name}</p>}
      <button onClick={handleUpload}>Odeslat soubor</button>
    </div>
  );
}

export default FileUploader;
