import type { Users } from "../../model/Users";


interface Props {
  user: Users;
}

export default function UserCard({ user }: Props) {
  return (
    <div className="bg-[#1c2536] p-4 rounded-xl shadow-md border border-gray-700">
      <h2 className="text-lg font-bold text-white">{user.name}</h2>
      <p className="text-gray-300 text-sm">{user.email}</p>

      <div className="mt-4 flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg">
          Ver Detalhes
        </button>

        <button className="bg-orange-400 hover:bg-orange-700 text-white py-1 px-3 rounded-lg">
          Excluir
        </button>
      </div>
    </div>
  );
}
