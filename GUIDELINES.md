# Estrutura do Projeto

Documento para servir como um guideline para a estrutura do projeto, organização de arquivos, pastas, e padrões que devem ser seguidos.

## Princípios Fundamentais

### Package-by-feature / Feature-sliced-design

O projeto segue a arquitetura de pacotes por funcionalidade, ou seja, cada pacote é responsável por uma funcionalidade específica e todo código relacionado a essa funcionalidade (componentes, hooks, serviços) deve estar contido nesse pacote.

### Colocation

Mantenha os arquivos relacionados a uma funcionalidade juntos, ou seja, se um componente, hook ou serviço é utilizado apenas por uma funcionalidade, ele deve estar contido no mesmo pacote.

### Compartilhamento

O critério para o compartilhamento de código é apenas se o código é utilizado por mais de uma funcionalidade. Se um componente, hook ou serviço é utilizado por mais de uma funcionalidade, ele deve ser movido para um nível mais alto.

### Estrutura de Pastas

```
app/
    features/                           # Funcionalidades do projeto
        feature-name/                   # Ex: auth, challenges, profile
            components/                 # Componentes compartilhados pela funcionalidade
            hooks/                      # Hooks compartilhados pela funcionalidade
            services/                   # Serviços compartilhados pela funcionalidade
            schemas/                    # Schemas compartilhados pela funcionalidade
            pages/                      # Páginas da funcionalidade
    shared/                             # Código compartilhado globalmente por mais de uma funcionalidade
        components/                     # Componentes compartilhados
        hooks/                          # Hooks compartilhados
        services/                       # Serviços compartilhados
```

## Guidelines por Categoria

### Features

- Cada feature deve ter sua própria pasta dentro de `features/`
- O nome da feature deve refletir um domínio de negócio (ex: `auth`, `challenges`, `profile`)
- Uma feature deve conter tudo que é necessário para implementar sua funcionalidade (componentes, hooks, serviços, schemas)
- Features não devem importar código de outras features - se há necessidade de compartilhamento, o código deve ser movido para `shared/`

### Páginas

- Cada página é um componente completo que representa uma rota da aplicação
- Páginas devem ser expostas como um único componente (ex: `<ChallengesPage />`)

```
features/
    challenges/
        pages/
            challenges-page.tsx       # Componente principal
```

### Componentes

- Componentes que são usados em múltiplas páginas de uma feature ficam em `features/feature-name/components`
- Componentes compartilhados globalmente ficam em `shared/components`

### Hooks

- Hooks compartilhados em uma feature ficam em `features/feature-name/hooks`
- Hooks globais ficam em `shared/hooks`

### Código Compartilhado

O objetivo é centralizar funções, componentes e serviços comuns, evitando duplicação. No entanto, é essencial garantir que o código compartilhado seja **genérico**, **independente** e **não dependa do contexto específico de uma feature**.

- O código em `shared/` deve ser autossuficiente e não depender de código de features
- A pasta `shared/` deve conter apenas código que é verdadeiramente reutilizado em múltiplas features
- Quando uma funcionalidade começa a ser usada em mais de uma feature, ela deve ser movida para `shared/`
- A estrutura dentro de `shared/` deve seguir a mesma organização por tipo (components, hooks, utils, etc.)
- Ao mover algo para `shared/`, garanta que ele seja suficientemente genérico para ser utilizado em múltiplas features, mas sem comprometer a simplificação do código
- Não mova código específico demais, se o código que você pensa em mover ainda está muito vinculado a uma única feature, não o mova para `shared/` até que ele seja realmente reutilizado em mais de uma feature

### Convenções de Nomenclatura

- Usar PascalCase para nomes de componentes (ex: `MyComponent`)
- Usar extensão `.ts` para hooks e não `.tsx` (ex: `use-hook.ts`)
- Usar prefixo `$` para funções criadas usando `createServerFn()` (ex: `$fetchData`)
- Usar prefixo `use` para hooks customizados (ex: file `use-hook.ts`, hook `useHook`)
- Usar sufixo `page` para páginas (ex: file: `login-page.tsx`, component: `LoginPage`)
- Usar kebab-case para nomes de pastas e arquivos (ex: file: `my-component.tsx`, folder: `my-component/`)

# Conclusão

## Práticas a serem seguidas

1. **Mantenha a coesão**: Código que funciona junto deve estar junto
2. **Evite acoplamento**: Features não devem depender de outras features
3. **Seja consistente**: Siga os mesmos padrões em todo o projeto
4. **Pense em escalabilidade**: Organize o código de forma que facilite futuras adições e modificações e como ele se comportará com milhares de usuários por mais que isso não seja o caso atual
5. **Seja claro**: Dê nomes significativos para pastas e arquivos
6. **Seja conciso**: Evite pastas e arquivos desnecessários

## O que evitar

1. Não crie uma pasta `shared/` dentro de features
2. Não importe codigo diretamente de uma feature para outra
3. Não coloque código específico de uma página no nível de feature
4. Não duplique código - se um componente é usado em mais de uma feature, mova-o para `shared/`
5. Não misture código de diferentes funcionalidades
6. Não crie pastas e arquivos desnecessários
