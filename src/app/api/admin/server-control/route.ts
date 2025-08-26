import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (!['start', 'stop', 'restart'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be start, stop, or restart' },
        { status: 400 }
      );
    }

    const serverPath = process.env.ACC_SERVER_PATH;
    if (!serverPath) {
      return NextResponse.json(
        { error: 'ACC server path not configured' },
        { status: 500 }
      );
    }

    const serverExe = path.join(serverPath, 'accServer.exe');

    try {
      if (action === 'stop' || action === 'restart') {
        // Stop the server
        await execAsync('taskkill /F /IM accServer.exe');
        console.log('ACC server stopped');
        
        if (action === 'stop') {
          return NextResponse.json({ 
            success: true, 
            message: 'Server stopped successfully' 
          });
        }
        
        // Wait a moment before restart
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (action === 'start' || action === 'restart') {
        // Start the server
        const startCommand = `cd /D "${serverPath}" && start "" "${serverExe}"`;
        await execAsync(startCommand);
        console.log('ACC server started');
        
        return NextResponse.json({ 
          success: true, 
          message: `Server ${action}ed successfully` 
        });
      }

    } catch (error) {
      console.error(`Error ${action}ing server:`, error);
      
      // If it's a stop command and process doesn't exist, that's okay
      if (action === 'stop' && error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json({ 
          success: true, 
          message: 'Server was already stopped' 
        });
      }
      
      return NextResponse.json(
        { error: `Failed to ${action} server: ${error}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in server control API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}