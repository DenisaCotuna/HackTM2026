const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUserByEmail(email: string) {
  const res = await fetch(
    `${BASE_URL}/api/users/by-email?email=${email}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export async function createUser(data: any) {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}