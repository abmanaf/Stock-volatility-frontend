# VolatilityLab — GARCH Dashboard

A full-stack web application for training GARCH(p,q) volatility models and generating multi-day volatility forecasts for equities.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, SQLite
- **ML:** `arch` library for GARCH modeling
- **Data:** AlphaVantage API for stock prices

## Project Structure (Atomic Design)

```
src/
├── atoms/              # Basic UI primitives (Button, Input, Icon, etc.)
├── molecules/         # Simple component combinations (StatCard, MetricBox, etc.)
├── organisms/          # Complex UI components (AppSidebar, VolatilityChart)
├── templates/         # Page layouts (Dashboard, Fit, Predict)
├── app/              # Next.js routes
├── store/            # Zustand state management
└── lib/              # API client & utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- AlphaVantage API key

### Backend Setup

```bash
cd stock-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run the backend
python -m uvicorn main:app --reload --host localhost --port 8000
```

### Frontend Setup

```bash
cd stock-frontend

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Features

1. **Train GARCH Model**
   - Enter ticker symbol (e.g., AAPL, MSFT, TSLA)
   - Configure observations (50-5000 trading days)
   - Set ARCH (p) and GARCH (q) order parameters
   - Fetch fresh data from AlphaVantage or use cached data

2. **Generate Volatility Forecast**
   - Load a previously trained model
   - Select forecast horizon (1-30 business days)
   - View interactive volatility chart with data table
   - See peak and floor volatility values

3. **Dashboard**
   - View model training and prediction history
   - See recent activity with success/failure status
   - Quick actions to navigate between features

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/hello` | GET | Health check |
| `/fit` | POST | Train GARCH model |
| `/predict` | POST | Generate volatility forecast |

## Environment Variables

### Backend (.env)
```
ALPHA_API_KEY=your_alpha_vantage_key
DB_NAME=stocks.sqlite
MODEL_DIRECTORY=models
```

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## License

MIT