const avatar = document.getElementById("profile");

avatar.addEventListener("click", () => {
  const isAscii = avatar.src.includes("ascii");

  avatar.src = isAscii
    ? "/assets/img/profile.png"
    : "/assets/img/profile-ascii.png";

  avatar.style.width = isAscii ? "140px" : "145px";
});
