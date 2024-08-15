import logoImg from '../src/assets/quiz-logo.png'

const Header = () => {
    return (
        <header>
        <img src={logoImg} alt="" />
        <h1>ReactQuiz</h1>
        </header>
    )
}

export default Header;