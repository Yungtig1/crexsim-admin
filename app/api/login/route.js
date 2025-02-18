import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ADMIN_PIN = process.env.ADMIN_PIN // Default PIN, change this in production

export async function POST(request) {
  const { pin } = await request.json()

  if (pin === ADMIN_PIN) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" })
    return NextResponse.json({ token })
  } else {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 })
  }
}