import java.util.ArrayList;

public class Road {
	private final int rows;
	private final int columns;
	private final double phChance;
	
	private Tile[][] grid;
	private Tile initTile; // the starting tile
	private ArrayList<String> validPaths = new ArrayList<String>();
	
	public Road(int rows, int columns, double phChance) {
		this.rows = rows;
		this.columns = columns;
		this.phChance = phChance;
		
		grid = new Tile[rows][columns];
		
		reset();
	}
	
	public void reset() {
		for (int i = 0; i < rows; i++) {
			for (int j = 0; j < columns; j++) {
				grid[i][j] = new Tile(i, j, Math.random() <= phChance);
			}
		}
		
		// set new starting point
		initTile = grid[(int)(Math.random() * rows)][0];
		initTile.setPothole(false);
		
		generatePaths(null, initTile, "");
	}
	
	public void generatePaths(Tile prevTile, Tile curTile, String path) {
		int curRow = curTile.getRow();
		int curColumn = curTile.getColumn();
		
		String curPath;
		Tile nextTile;
		
		// subtract `curRow` from `rows - 1` to move (0, 0) from top-left to bottom-left of grid
		if (path.isEmpty()) {
			curPath = "(" + curColumn + ", " + (rows - 1 - curRow) + ")";
		} else {
			curPath = path + " -> (" + curColumn + ", " + (rows - 1 - curRow) + ")";
		}
		
		// do not check if tile is pothole
		if (curTile.getPothole()) {
			return;
		}

		if (curColumn < columns - 1) {
			nextTile = grid[curRow][curColumn + 1];	
			generatePaths(curTile, nextTile, curPath); // check right tile
		
			if (curRow > 0) {
				nextTile = grid[curRow - 1][curColumn];
				
				if (!nextTile.equals(prevTile)) {
					generatePaths(curTile, nextTile, curPath); // check above tile
				}
			}
			
			if (curRow < rows - 1) {
				nextTile = grid[curRow + 1][curColumn];
				
				if (!nextTile.equals(prevTile)) {
					generatePaths(curTile, nextTile, curPath); // check below tile
				}
			}
		} else {
			validPaths.add(curPath); // reached right side
		}
	}
	
	public void drawGrid() {
		System.out.println("Grid:");
		
		for (int i = 0; i < rows; i++) {
			for (int j = 0; j < columns; j++) {
				String str = "O";
				
				if (grid[i][j].getPothole()) {
					str = "X";
				}
				
				System.out.print(str + " ");
				
				if (j == columns - 1) {
					System.out.println();
				}
			}
		}
	}
	
	public void showPaths() {
		System.out.println("Valid Paths:");
		
		if (validPaths.size() == 0) {
			System.out.println("None");
		} else {
			for (int i = 0; i < validPaths.size(); i++) {
				System.out.println(validPaths.get(i));
			}
		}
	}
	
	public void showAnswer() {
		System.out.println("Answer:\nTotal valid paths from starting point " + "(" + initTile.getColumn() + ", " + (rows - 1 - initTile.getRow()) + ")" + " is " + validPaths.size());
	}
}
