"use client";
import Swal from "sweetalert2";
const styled = Swal.mixin({
  confirmButtonColor: "#001c3f",
  cancelButtonColor: "#66758b",
  reverseButtons: true,
});
export async function confirm(title: string, text: string) {
  return (
    await styled.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusCancel: true,
    })
  ).isConfirmed;
}
export async function success(text: string) {
  await styled.fire({ title: "Done", text, icon: "success" });
}
export async function showError(text: string) {
  await styled.fire({ title: "Unable to complete", text, icon: "error" });
}
export { api } from "./api";
