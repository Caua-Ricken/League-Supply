const UserFooter = () => {
    return (
      <footer className="user-footer">
        <div className="user-footer-conteudo">
          <div>
            <strong className="user-footer-brand">
              LEAGUE<span>★</span>SUPPLY
            </strong>
  
            <p>American Sports Culture.</p>
          </div>
  
          <small>
            © {new Date().getFullYear()} League Supply.
            Todos os direitos reservados.
          </small>
        </div>
      </footer>
    );
  };
  
  export default UserFooter;