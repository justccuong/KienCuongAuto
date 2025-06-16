const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

res.cookie("token", token, {
  httpOnly: true,     
  secure: true,       
  sameSite: "strict",
  maxAge: 86400000,   
}).json({ message: "Login success" });