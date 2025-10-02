import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const form = new FormData();
form.append("file", fs.createReadStream("D:\\My Programmes\\Hacktoberfest\\B2B-Newsletter-SaaS\\B2B-Newsletter-SaaS\\app\\context.pdf"));
form.append("companyName", "TechCorp");
form.append("audience", "Startup founders");
form.append("topic", "AI in SaaS");
form.append("tone", "Professional");

(async () => {
  const res = await fetch("http://localhost:3000/newsletter", {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  console.log(json);
})();
