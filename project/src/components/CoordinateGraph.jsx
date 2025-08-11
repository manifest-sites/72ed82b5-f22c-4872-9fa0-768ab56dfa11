import { useState } from 'react'
import { Scatter } from 'react-chartjs-2'
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import dragDataPlugin from 'chartjs-plugin-dragdata'
import { Input, Button, Card, Space, Typography, Row, Col } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, dragDataPlugin)

const { Title } = Typography

function CoordinateGraph() {
  const [coordinates, setCoordinates] = useState([])
  const [xInput, setXInput] = useState('')
  const [yInput, setYInput] = useState('')
  const [colorInput, setColorInput] = useState('#3b82f6')

  const addCoordinate = () => {
    const x = parseFloat(xInput)
    const y = parseFloat(yInput)
    
    if (!isNaN(x) && !isNaN(y)) {
      setCoordinates([...coordinates, { x, y, color: colorInput }])
      setXInput('')
      setYInput('')
    }
  }

  const removeCoordinate = (index) => {
    const newCoordinates = coordinates.filter((_, i) => i !== index)
    setCoordinates(newCoordinates)
  }

  const clearAll = () => {
    setCoordinates([])
  }

  const chartData = {
    datasets: [
      {
        label: 'Coordinates',
        data: coordinates.map(coord => ({ x: coord.x, y: coord.y })),
        backgroundColor: coordinates.map(coord => coord.color || '#3b82f6'),
        borderColor: coordinates.map(coord => coord.color || '#3b82f6'),
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Coordinate Graph (Drag points to move them)',
      },
      dragData: {
        round: 2,
        showTooltip: true,
        dragX: true,
        dragY: true,
        onDragStart: function(e, element) {
          // Optional: handle drag start
        },
        onDrag: function(e, datasetIndex, index, value) {
          // Update coordinates while dragging
          const newCoordinates = [...coordinates]
          newCoordinates[index] = { x: value.x, y: value.y, color: coordinates[index].color }
          setCoordinates(newCoordinates)
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          // Final update when drag ends
          const newCoordinates = [...coordinates]
          newCoordinates[index] = { x: value.x, y: value.y, color: coordinates[index].color }
          setCoordinates(newCoordinates)
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'X Axis',
        },
        min: 0,
        max: 10,
      },
      y: {
        title: {
          display: true,
          text: 'Y Axis',
        },
        min: 0,
        max: 10,
      },
    },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={2} className="text-center mb-6">Coordinate Graph</Title>
      
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card title="Add Coordinates" className="mb-6">
            <Space direction="vertical" className="w-full">
              <div>
                <label className="block text-sm font-medium mb-2">X Coordinate:</label>
                <Input
                  type="number"
                  placeholder="Enter X value"
                  value={xInput}
                  onChange={(e) => setXInput(e.target.value)}
                  onPressEnter={addCoordinate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Y Coordinate:</label>
                <Input
                  type="number"
                  placeholder="Enter Y value"
                  value={yInput}
                  onChange={(e) => setYInput(e.target.value)}
                  onPressEnter={addCoordinate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color:</label>
                <Input
                  type="color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={addCoordinate}
                className="w-full"
              >
                Add Point
              </Button>
            </Space>
          </Card>

          <Card title="Coordinate List" className="mb-6">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {coordinates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No coordinates added yet</p>
              ) : (
                coordinates.map((coord, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300" 
                        style={{ backgroundColor: coord.color }}
                      ></div>
                      <span>({coord.x}, {coord.y})</span>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeCoordinate(index)}
                    />
                  </div>
                ))
              )}
            </div>
            {coordinates.length > 0 && (
              <Button 
                danger 
                onClick={clearAll} 
                className="w-full mt-4"
              >
                Clear All
              </Button>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Graph">
            <div style={{ height: '600px' }}>
              {coordinates.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Add some coordinates to see them plotted here
                </div>
              ) : (
                <Scatter data={chartData} options={chartOptions} />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CoordinateGraph