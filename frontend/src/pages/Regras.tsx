
import { Link as RouterLink } from "react-router";

// Página com as regras para criação de links
const Regras = () => {
    return (
        <main className="page">
            <header className="topbar">
                <h1 className="topbar__title">Regras para criar links no Linkly</h1>
                <RouterLink className="nav-link" to="/dashboard">Voltar ao Dashboard</RouterLink>
            </header>

            <div className="card regras">
                {/* Regras do slug */}
                <section>
                    <h2>1. Slug (nome personalizado)</h2>

                    <p>
                        O slug é a parte final do link encurtado.
                    </p>

                    <h3>Regras obrigatórias</h3>
                    <ul>
                        <li>Deve conter entre 4 e 30 caracteres.</li>
                        <li>Aceita apenas letras minúsculas (a-z), números (0-9) e hífens (-).</li>
                        <li>Não pode conter espaços, acentos ou caracteres especiais.</li>
                        <li>Não pode começar ou terminar com hífen.</li>
                        <li>Não pode conter hífens consecutivos.</li>
                        <li>Não pode ser repetido entre os links do mesmo usuário.</li>
                    </ul>

                    <h3>Exemplos válidos</h3>
                    <ul>
                        <li><code>github</code></li>
                        <li><code>facebook</code></li>
                        <li><code>meu-portfolio</code></li>
                        <li><code>projeto123</code></li>
                    </ul>

                    <h3>Exemplos inválidos</h3>
                    <ul>
                        <li><code>Face</code> — contém letra maiúscula.</li>
                        <li><code>abc</code> — menos de 4 caracteres.</li>
                        <li><code>meu link</code> — contém espaço.</li>
                        <li><code>ação</code> — contém acento.</li>
                        <li><code>-github</code> — começa com hífen.</li>
                        <li><code>meu--link</code> — contém hífens consecutivos.</li>
                    </ul>
                </section>

                {/* Regras da URL de destino */}
                <section>
                    <h2>2. URL de destino</h2>

                    <p>
                        É o endereço para o qual o usuário será redirecionado.
                    </p>

                    <h3>Regras obrigatórias</h3>
                    <ul>
                        <li>Deve começar com http:// ou https://.</li>
                        <li>Deve conter no máximo 2.048 caracteres.</li>
                        <li>Não pode conter espaços ou quebras de linha.</li>
                        <li>Deve ser uma URL válida.</li>
                    </ul>

                    <h3>Exemplos válidos</h3>
                    <ul>
                        <li><code>https://www.facebook.com/</code></li>
                        <li><code>https://github.com/</code></li>
                        <li><code>https://www.google.com/</code></li>
                    </ul>

                    <h3>Exemplos inválidos</h3>
                    <ul>
                        <li><code>www.facebook.com</code> — falta o protocolo.</li>
                        <li><code>facebook.com</code> — falta o protocolo.</li>
                        <li><code>ftp://exemplo.com</code> — protocolo não permitido.</li>
                        <li><code>https://meu site.com</code> — contém espaço.</li>
                    </ul>
                </section>

                {/* Exemplo de criação */}
                <section>
                    <h2>3. Resultado esperado</h2>

                    <p>Imagine que você cadastrou:</p>

                    <p>
                        <strong>Slug:</strong> <code>facebook</code>
                    </p>

                    <p>
                        <strong>URL de destino:</strong>{" "}
                        <code>https://www.facebook.com/</code>
                    </p>

                    <p>O Linkly gera um endereço semelhante a:</p>

                    <p>
                        <code>
                            https://linkly-6goz.onrender.com/seu-usuario/facebook
                        </code>
                    </p>

                    <p>
                        Ao acessar esse endereço, o visitante será
                        redirecionado para o Facebook.
                    </p>
                </section>

                {/* Informações adicionais */}
                <section>
                    <h2>4. Regras adicionais</h2>

                    <ul>
                        <li>
                            É necessário estar autenticado para criar,
                            editar ou excluir links.
                        </li>
                        <li>
                            Cada usuário pode gerenciar seus próprios links.
                        </li>
                        <li>
                            O contador de cliques registra os acessos
                            aos links encurtados.
                        </li>
                        <li>
                            A exclusão de um link impede novos
                            redirecionamentos por aquele endereço.
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
};

export default Regras;
