export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectDB } = await import("@/lib/mongodb");
    await connectDB();
  }
}
