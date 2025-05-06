async function testUserAPI() {
  // Test GET user
  const userResponse = await fetch(
    "http://localhost:3001/api/users/user_id_here"
  );
  console.log("User:", await userResponse.json());

  // Test other endpoints...
}

testUserAPI().catch(console.error);
