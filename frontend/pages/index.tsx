import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  fullname: string;
  lastname: string;
  age: number;
};

export default function CrudPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>({ id: 0, fullname: "", lastname: "", age: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const api = "http://localhost:5000/users";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(api);
    setUsers(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`${api}/${editingId}`, { ...form, id: editingId });
      setEditingId(null);
    } else {
      await axios.post(api, form);
    }
    setForm({ id: 0, fullname: "", lastname: "", age: 0 });
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setEditingId(user.id);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${api}/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD Example</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          name="id"
          type="number"
          placeholder="ID"
          value={form.id}
          onChange={handleChange}
        />
        <input
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
        />
        <input
          name="lastname"
          placeholder="Last Name"
          value={form.lastname}
          onChange={handleChange}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullname}</td>
              <td>{u.lastname}</td>
              <td>{u.age}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
