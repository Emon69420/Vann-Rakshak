import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MapViewer from '@/components/MapViewer';
import { 
  Satellite, 
  RefreshCw, 
  Download,
  Layers,
  BarChart3,
  TreePine,
  Droplets,
  Wheat,
  Home,
  MapPin,
  Calendar,
  Camera
} from 'lucide-react';

interface AssetStats {
  totalArea: number;
  forestCover: number;
  agricultureArea: number;
  waterBodies: number;
  settlements: number;
  lastUpdated: string;
}

interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  currentTask: string;
}

const AssetMapping = () => {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    progress: 0,
    currentTask: 'Idle'
  });

  const [selectedRegion, setSelectedRegion] = useState('bastar-district');

  // Sample asset statistics
  const assetStats: AssetStats = {
    totalArea: 45670.8,
    forestCover: 32458.2,
    agricultureArea: 8945.6,
    waterBodies: 2156.3,
    settlements: 2110.7,
    lastUpdated: '2024-01-15'
  };

  const startProcessing = () => {
    setProcessingStatus({ isProcessing: true, progress: 0, currentTask: 'Downloading satellite imagery...' });
    
    // Simulate processing steps
    const steps = [
      { progress: 20, task: 'Downloading satellite imagery...' },
      { progress: 40, task: 'Preprocessing images...' },
      { progress: 60, task: 'Running land classification model...' },
      { progress: 80, task: 'Detecting water bodies...' },
      { progress: 100, task: 'Generating asset map layers...' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProcessingStatus({
          isProcessing: index < steps.length - 1,
          progress: step.progress,
          currentTask: step.task
        });
      }, (index + 1) * 2000);
    });
  };

  const formatArea = (area: number) => {
    if (area >= 1000) {
      return `${(area / 1000).toFixed(1)}K Ha`;
    }
    return `${area.toFixed(1)} Ha`;
  };

  const getPercentage = (area: number) => {
    return ((area / assetStats.totalArea) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold gradient-text">
            Asset Mapping
          </h1>
          <p className="text-muted-foreground mt-2">
            Satellite-derived land classification and resource mapping
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Layers</span>
          </Button>
          <Button 
            onClick={startProcessing}
            disabled={processingStatus.isProcessing}
            className="flex items-center space-x-2"
          >
            {processingStatus.isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Satellite className="w-4 h-4" />
            )}
            <span>
              {processingStatus.isProcessing ? 'Processing...' : 'Update Satellite Data'}
            </span>
          </Button>
        </div>
      </div>

      {/* Processing Status */}
      {processingStatus.isProcessing && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Satellite className="w-8 h-8 text-primary animate-pulse" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Satellite Data Processing</h3>
                <p className="text-sm text-muted-foreground mb-3">{processingStatus.currentTask}</p>
                <Progress value={processingStatus.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {processingStatus.progress}% Complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Asset Statistics */}
        <div className="space-y-6">
          {/* Overview Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Asset Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatArea(assetStats.totalArea)}</div>
                <div className="text-sm text-muted-foreground">Total Analyzed Area</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-layer-forest" />
                    <span className="text-sm">Forest Cover</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatArea(assetStats.forestCover)}</div>
                    <div className="text-xs text-muted-foreground">{getPercentage(assetStats.forestCover)}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wheat className="w-4 h-4 text-layer-agriculture" />
                    <span className="text-sm">Agriculture</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatArea(assetStats.agricultureArea)}</div>
                    <div className="text-xs text-muted-foreground">{getPercentage(assetStats.agricultureArea)}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-layer-water" />
                    <span className="text-sm">Water Bodies</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatArea(assetStats.waterBodies)}</div>
                    <div className="text-xs text-muted-foreground">{getPercentage(assetStats.waterBodies)}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-layer-settlement" />
                    <span className="text-sm">Settlements</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatArea(assetStats.settlements)}</div>
                    <div className="text-xs text-muted-foreground">{getPercentage(assetStats.settlements)}%</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Last updated: {assetStats.lastUpdated}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Data Sources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded border">
                <div className="font-medium text-sm">Sentinel-2</div>
                <div className="text-xs text-muted-foreground">10m resolution, multispectral</div>
                <Badge variant="secondary" className="mt-1">Active</Badge>
              </div>
              
              <div className="p-3 rounded border">
                <div className="font-medium text-sm">Landsat 8/9</div>
                <div className="text-xs text-muted-foreground">30m resolution, thermal bands</div>
                <Badge variant="secondary" className="mt-1">Active</Badge>
              </div>
              
              <div className="p-3 rounded border">
                <div className="font-medium text-sm">SRTM DEM</div>
                <div className="text-xs text-muted-foreground">30m elevation data</div>
                <Badge variant="secondary" className="mt-1">Static</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Processing Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>AI Models</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded border">
                <div className="font-medium text-sm">Land Classification</div>
                <div className="text-xs text-muted-foreground mb-2">Random Forest Classifier</div>
                <Progress value={94} className="h-1" />
                <div className="text-xs text-muted-foreground mt-1">94% Accuracy</div>
              </div>
              
              <div className="p-3 rounded border">
                <div className="font-medium text-sm">Water Detection</div>
                <div className="text-xs text-muted-foreground mb-2">NDWI + Deep Learning</div>
                <Progress value={87} className="h-1" />
                <div className="text-xs text-muted-foreground mt-1">87% Accuracy</div>
              </div>
              
              <div className="p-3 rounded border">
                <div className="font-medium text-sm">Forest Mapping</div>
                <div className="text-xs text-muted-foreground mb-2">NDVI + Canopy Analysis</div>
                <Progress value={92} className="h-1" />
                <div className="text-xs text-muted-foreground mt-1">92% Accuracy</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Asset Classification Map</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapViewer height="700px" showControls={true} />
              
              {/* Map Legend */}
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-3">Asset Classification Legend</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-layer-forest rounded"></div>
                    <span className="text-sm">Forest Cover</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-layer-agriculture rounded"></div>
                    <span className="text-sm">Agriculture</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-layer-water rounded"></div>
                    <span className="text-sm">Water Bodies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-layer-settlement rounded"></div>
                    <span className="text-sm">Settlements</span>
                  </div>
                </div>
              </div>

              {/* Analysis Tools */}
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download GeoTIFF
                </Button>
                <Button variant="outline" size="sm">
                  <Layers className="w-4 h-4 mr-2" />
                  Layer Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetMapping;
