import React, { useEffect, useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'


interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [showTooltip, setShowTooltip] = useState({
    first: false,
    second: false,
    third: false,
  });

  const toggleTooltip = (index: keyof typeof showTooltip) => {
    setShowTooltip((prevShowTooltip) => ({
      ...prevShowTooltip,
      [index]: !prevShowTooltip[index],
    }));
  };

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);


  return (
    <div className="home-page">
      <header>
        <h1>Постирония</h1>
        <p>Удобное бронирование стирки для студентов НИУ ВШЭ-Пермь</p>
      </header>
      <main>
        <section className="hero">
          <h2>Забудьте о проблемах со стиркой!</h2>
          <p>Бронирование стирки стало проще, чем никогда!</p>
          <button onClick={() => {            
            if (isAuthenticated) {
              navigate('/slotsschedule');
            } 
            else
            {
              navigate('/login');
            }
          }}>Начать бронирование</button>
        </section>
        <section className="testimonials">
          <h2>Что мы предлагаем</h2>
          <ul>
            <li onClick={() => toggleTooltip('first')}>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <p>Бронирование стирки на удобное для вас время</p>
                {showTooltip.first && (
                  <div className="tooltip">
                    <span>Выберите время, которое вам подходит, и забронируйте стирку заранее!</span>
                  </div>
                )}
              </div>
            </li>
            <li onClick={() => toggleTooltip('second')}>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <p>Оперативная информация о статусе стиральных машин</p>
                {showTooltip.second && (
                  <div className="tooltip">
                    <span>Получайте информацию о доступности стиральных машин в режиме реального времени!</span>
                  </div>
                )}
              </div>
            </li>
            <li onClick={() => toggleTooltip('third')}>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <p>Удобное управление бронированием и отслеживание статуса</p>
                {showTooltip.third && (
                  <div className="tooltip">
                    <span>Управляйте своими бронированиями и отслеживайте статус стирки в одном месте!</span>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </section>
        <section className="testimonials">
          <h2>Что говорят наши пользователи</h2>
          <blockquote>
            <p>"Постирония - это лучшее, что произошло со стиркой в нашем общежитии!"</p>
            <cite>Алексей, студент НИУ ВШЭ-Пермь</cite>
          </blockquote>
          <blockquote>
            <p>"Теперь я могу планировать свой день заранее, не беспокоясь о стирке!"</p>
            <cite>Екатерина, студентка НИУ ВШЭ-Пермь</cite>
          </blockquote>
          <blockquote>
            <p>"Благодаря 'Постиронии' я больше не теряю время на стирку! Удобно и быстро."</p>
            <cite>Ваня, студент НИУ ВШЭ-Пермь</cite>
          </blockquote>
        </section>
        <section className="accordion">
          <h2>Часто задаваемые вопросы</h2>
          <div className="card">
            <div className="card-header">
              <a className="question">
                <h6 className="question-text">Как бронировать стирку в приложении?</h6>
              </a>
            </div>
            <div className="panel-collapse">
              <div className="panel-body">
                <p className="answer-text">Для бронирования стирки в Постиронии просто выберите удобное время, и нажмите 'Забронировать'.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <a className="question">
                <h6 className="question-text">Как отменить бронирование стирки?</h6>
              </a>
            </div>
            <div className="panel-collapse">
              <div className="panel-body">
                <p className="answer-text">Для отмены бронирования стирки в Постиронии зайдите в раздел 'Мои бронирования' и нажмите 'Отменить' рядом с соответствующим бронированием.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <a className="question">
                <h6 className="question-text">Почему стоит использовать приложение?</h6>
              </a>
            </div>
            <div className="panel-collapse">
              <div className="panel-body">
                <p className="answer-text">Забудьте о беготне на вахту и договоренностях в чатах. Бронируйте стирку заранее и экономьте время!</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <a className="question">
                <h6 className="question-text">Что делать при возникновении ошибок?</h6>
              </a>
            </div>
            <div className="panel-collapse">
              <div className="panel-body">
                <p className="answer-text">Обратитесь в службу поддержки для быстрого решения любых вопросов и проблем. Мы всегда на связи!</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;