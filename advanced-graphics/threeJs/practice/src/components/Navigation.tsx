import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const NavigationContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  z-index: 1;
`

const Arrow = styled.button<{ disabled: boolean }>`
  background: none;
  border: none;
  font-size: 3rem;
  color: ${({ disabled }) => (disabled ? '#999' : '#333')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover:not(:disabled) {
    transform: scale(1.2);
  }

  &:disabled {
    opacity: 0.5;
  }
`

const LEVEL_ORDER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'bonus']

export const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.split('/').pop() || '0'
  const currentIndex = LEVEL_ORDER.indexOf(currentPath)

  const goToLevel = (index: number) => {
    const level = LEVEL_ORDER[index]
    navigate(`/level/${level}`)
  }

  const isDevPath = location.pathname === '/dev'

  if (isDevPath) return null

  return (
    <NavigationContainer>
      <Arrow
        onClick={() => goToLevel(currentIndex - 1)}
        disabled={currentIndex <= 0}
      >
        ←
      </Arrow>
      <Arrow
        onClick={() => goToLevel(currentIndex + 1)}
        disabled={currentIndex >= LEVEL_ORDER.length - 1}
      >
        →
      </Arrow>
    </NavigationContainer>
  )
}

export const LevelNav = styled.nav`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  max-width: 400px;
  justify-content: flex-end;
  padding: 1rem;
`

export const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #333;
  border-radius: 4px;
  
  &:hover {
    background-color: #333;
    color: #f5f5f5;
  }
`