export async function evoluirGrade(grade) {
    const resposta = await fetch("/api/evoluir", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            grade,
        }),
    });

    if(!resposta.ok) {
        throw new Error("Erro ao evoluir a grade.");
    }

    const dados = await resposta.json();
    return dados.grade;
}