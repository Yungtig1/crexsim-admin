import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export async function PATCH(request, { params }) {
    await dbConnect();
  
    try {
      const id = (await params).id
      const body = await request.json();
      const balance = parseFloat(body.balance); // Ensure we're working with a number
  
      if (isNaN(balance)) {
        return NextResponse.json(
          { error: "Invalid balance value provided" },
          { status: 400 }
        );
      }
  
      console.log("Updating user with ID:", id);
      console.log("New balance:", balance);
  
      // Update the user's balance directly in the database
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { balance: balance } }, // Use $set to ensure we're setting the field
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      console.log("Updated user:", updatedUser);
  
      return NextResponse.json(
        { message: "User updated successfully", user: { _id: updatedUser._id, balance: updatedUser.balance } },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "An error occurred while updating the user" },
        { status: 500 }
      );
    }
  }

export async function DELETE(request, { params }) {
  await dbConnect()

  try {
    const id = (await params).id
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "An error occurred while deleting the user" }, { status: 500 })
  }
}

