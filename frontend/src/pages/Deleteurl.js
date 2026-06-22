// import { useState } from "react";

// function DeleteURL() {
//   const [id, setId] = useState("");

//   const deleteURL = async () => {
//     const res = await fetch(
//       `http://localhost:8000/url/${id}`,
//       {
//         method: "DELETE",
//         credentials: "include",
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       alert("URL Deleted");
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Delete URL</h2>

//       <input
//         placeholder="URL ID"
//         onChange={(e) => setId(e.target.value)}
//       />

//       <button onClick={deleteURL}>
//         Delete URL
//       </button>
//     </div>
//   );
// }

// export default DeleteURL;
import { useState } from "react";

function DeleteURL() {
  const [id, setId] = useState("");

  const deleteURL = async () => {
    const res = await fetch(
      `http://localhost:8000/url/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("URL Deleted");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="card">
      <h2>Delete URL</h2>

      <input
        placeholder="URL ID"
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={deleteURL}>
        Delete URL
      </button>
    </div>
  );
}

export default DeleteURL;